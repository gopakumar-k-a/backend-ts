import validator from "validator";
import sanitizeHtml from "sanitize-html";

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
interface UploadedFile {
  fieldname: string;
  originalname: string;
  mimetype: string;
  size: number;
}

interface FormDataPayload {
  text: string;
  email: string;
  password: string;
  date: string;
  number: string;
  checkbox: boolean;
  radio: string;
  textarea: string;
  select: string;
  token: string;
}
export const userValidator = {
  validateChangePassword: ({
    currentPassword,
    newPassword,
    confirmPassword,
  }: ChangePasswordPayload): string[] => {
    const errors: string[] = [];

    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=\S{8,})/;

    if (!currentPassword) errors.push("Current password is required");
    else if (currentPassword === newPassword) {
      errors.push("New password cannot be the same as the current password");
    }

    if (!newPassword) errors.push("New password is required");
    else if (!passwordRegex.test(newPassword)) {
      errors.push(
        "New password must be at least 8 characters long and contain at least one special character"
      );
    }

    if (!confirmPassword) errors.push("Confirm new password is required");
    else if (newPassword !== confirmPassword) {
      errors.push("New password and confirm password do not match");
    }

    return errors;
  },

  validateFileUploads: (files: UploadedFile[]): string[] => {
    const errors: string[] = [];

    const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxFileSize = 5 * 1024 * 1024;

    if (!files || files.length === 0) {
      errors.push("At least one file is required");
      return errors;
    }

    files.forEach((file) => {
      if (!allowedFileTypes.includes(file.mimetype)) {
        errors.push(
          `File type ${
            file.mimetype
          } is not allowed. Allowed types: ${allowedFileTypes.join(", ")}`
        );
      }

      if (file.size > maxFileSize) {
        errors.push(
          `File ${file.originalname} is too large. Maximum size is 5MB`
        );
      }
    });

    return errors;
  },
  validateFormData: (data: FormDataPayload): string[] => {
    const errors: string[] = [];
    if (!data.token || data.token.trim() === "") {
      errors.push("token is required");
    }
    if (!data.text || data.text.trim() === "") {
      errors.push("Text is required");
    }

    if (!data.email || data.email.trim() === "") {
      errors.push("Email is required");
    } else if (!validator.isEmail(data.email)) {
      errors.push("Invalid email address");
    }

    if (!data.password || data.password.trim() === "") {
      errors.push("Password is required");
    }

    if (!data.date || data.date.trim() === "") {
      errors.push("Date is required");
    }

    if (!data.number || data.number.trim() === "") {
      errors.push("Number is required");
    }

    if (data.checkbox === undefined) {
      errors.push("Checkbox must be checked");
    }

    if (!data.radio || !["option1", "option2"].includes(data.radio)) {
      errors.push("Invalid radio selection");
    }

    if (!data.textarea || data.textarea.trim() === "") {
      errors.push("Textarea is required");
    }

    if (!data.select || !["option1", "option2"].includes(data.select)) {
      errors.push("Invalid select option");
    }

    data.text = sanitizeHtml(data.text);
    data.textarea = sanitizeHtml(data.textarea);

    return errors;
  },
};
