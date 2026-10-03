"use client";

import { Button, Modal } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDrink, drinksKey } from "@/lib/drinks";
import type { DrinkOption } from "@/lib/types";

interface Props {
  drink: DrinkOption;
  onClose: () => void;
}

export function DeleteDrinkModal({ drink, onClose }: Props) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => deleteDrink(drink.type),
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
        <Modal.Dialog className="sm:max-w-100">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Excluir bebida</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <p className="text-sm text-muted">
              Tem certeza que deseja excluir <strong>{drink.label}</strong>? Essa ação
              não pode ser desfeita.
            </p>
            {mutation.isError && (
              <p role="alert" className="mt-3 text-sm text-danger">
                {mutation.error.message}
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onPress={onClose}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              isDisabled={mutation.isPending}
              onPress={() => mutation.mutate()}
            >
              {mutation.isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
