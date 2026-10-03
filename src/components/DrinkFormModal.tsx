"use client";

import { Button, Input, Label, Modal, Switch, TextField } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { createDrink, drinksKey, updateDrink } from "@/lib/drinks";
import { formatBRL, maskBRL, parsePrice } from "@/lib/format";
import type { DrinkOption } from "@/lib/types";

const formSchema = z.object({
  label: z.string().trim().min(1, "Informe o nome da bebida"),
  price: z
    .string()
    .refine((v) => {
      const n = parsePrice(v);
      return v.trim() !== "" && Number.isFinite(n) && n >= 0;
    }, "Informe um valor válido"),
  hasMilk: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  drink: DrinkOption | null;
  onClose: () => void;
}

export function DrinkFormModal({ drink, onClose }: Props) {
  const queryClient = useQueryClient();
  const isEdit = drink !== null;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: drink?.label ?? "",
      price: drink ? formatBRL(drink.price) : "",
      hasMilk: drink?.hasMilk ?? false,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const input = {
        label: values.label.trim(),
        price: parsePrice(values.price),
        hasMilk: values.hasMilk,
      };
      return drink ? updateDrink(drink.type, input) : createDrink(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: drinksKey });
      onClose();
    },
  });

  return (
    <Modal.Backdrop
      isOpen
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-110">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>{isEdit ? "Editar Bebida" : "Nova Bebida"}</Modal.Heading>
          </Modal.Header>
          <form onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate>
            <Modal.Body className="flex flex-col gap-5">
              <TextField isInvalid={!!errors.label} fullWidth>
                <Label>Nome</Label>
                <Input placeholder="Ex: Chai Latte" autoFocus {...register("label")} />
                {errors.label && (
                  <span className="text-xs text-danger">{errors.label.message}</span>
                )}
              </TextField>

              <TextField isInvalid={!!errors.price} fullWidth>
                <Label>Valor</Label>
                <Controller
                  control={control}
                  name="price"
                  render={({ field }) => (
                    <Input
                      placeholder={formatBRL(0)}
                      inputMode="numeric"
                      value={field.value}
                      onChange={(e) => field.onChange(maskBRL(e.target.value))}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  )}
                />
                {errors.price && (
                  <span className="text-xs text-danger">{errors.price.message}</span>
                )}
              </TextField>

              <Controller
                control={control}
                name="hasMilk"
                render={({ field }) => (
                  <Switch isSelected={field.value} onChange={field.onChange}>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                    <Switch.Content>
                      <Label>Tem leite?</Label>
                      <span className="text-xs text-muted">
                        Habilita a escolha de tipo de leite no pedido
                      </span>
                    </Switch.Content>
                  </Switch>
                )}
              />

              {mutation.isError && (
                <p role="alert" className="text-sm text-danger">
                  {mutation.error.message}
                </p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button type="button" variant="secondary" onPress={onClose}>
                Cancelar
              </Button>
              <Button type="submit" isDisabled={mutation.isPending}>
                {mutation.isPending ? "Salvando..." : "Salvar Bebida"}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
