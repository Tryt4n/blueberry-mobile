import { useCallback } from "react";
import type { MutableRefObject } from "react";

/**
 * Creates a function to handle the `onSubmitEditing` event for a TextInput component.
 *
 * @template T - The type of the form object.
 * @param isSubmitting - State indicating whether the form is currently being submitted.
 * @param form - Form object containing field values.
 * @param focusRef - Reference to the TextInput component to be focused when the form is being submitted or when any field is empty.
 * @param fn - Function to be called when the form is not being submitted and no field is empty.
 * @param optionalFields - Array of field names that are not required to be filled in.
 *
 * @returns Returns a function that either focuses on the TextInput specified by `focusRef`, or calls the function `fn`, depending on the state of the form.
 *
 * @example
 * // Example usage in SignInPage component
 * <FormField
 *   ref={loginRef}
 *   onSubmitEditing={createOnSubmitEditing(isSubmitting, formValues, ref, functionToCall)}
 * />
 */

export function useOnSubmitEditing<
  T extends Record<string, string | number | null>,
  R extends { focus: () => void } = any
>(
  isSubmitting: boolean,
  form: T,
  focusRef: MutableRefObject<R | null>,
  fn: () => void,
  optionalFields: Array<keyof T> = []
) {
  return useCallback(() => {
    const isAnyRequiredFieldEmpty = Object.entries(form).some(([key, value]) => {
      return !optionalFields.includes(key as keyof T) && (value === "" || value === null);
    });

    if (isSubmitting || isAnyRequiredFieldEmpty) {
      focusRef.current?.focus?.();
    } else {
      fn();
    }
  }, [isSubmitting, form, focusRef, fn, optionalFields]);
}
