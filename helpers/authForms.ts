import type { TextInput } from "react-native";

/**
 * Creates a function to handle the `onSubmitEditing` event for a TextInput component.
 *
 * @template T - The type of the form object.
 * @param isSubmitting - State indicating whether the form is currently being submitted.
 * @param form - Form object containing field values.
 * @param focusRef - Reference to the TextInput component to be focused when the form is being submitted or when any field is empty.
 * @param fn - Function to be called when the form is not being submitted and no field is empty.
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
export function createOnSubmitEditing<T extends Record<string, string>>(
  isSubmitting: boolean,
  form: T,
  focusRef: React.RefObject<TextInput>,
  fn: () => void
) {
  return () => {
    if (isSubmitting || Object.values(form).some((value) => value === "")) {
      focusRef.current?.focus();
    } else {
      fn();
    }
  };
}
