interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  address: string;
  gender: string;
   userName: string;
}
  interface LoginPayload {
     userName: string;
    password: string;
  }
  
  export const authValidator = {
     validateRegister: ({ name, address, password, gender,  userName }: RegisterPayload): string[] => {
      const errors: string[] = [];
    
      if (!name) errors.push("Name is required");
    
    
      const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=\S{8,})/;
      if (!password) {
        errors.push("Password is required");
      } else if (!passwordRegex.test(password)) {
        errors.push(
          "Password must be at least 8 characters long and contain at least one special character"
        );
      }

    
      if (!address) errors.push("Address is required");
    
      if (!gender) errors.push("Gender is required");
      else if (!['male', 'female', 'other'].includes(gender.toLowerCase())) {
        errors.push("Gender must be 'male', 'female', or 'other'");
      }
    
      if (! userName) errors.push(" userName is required");
      else if ( userName.length < 3) {
        errors.push(" userName must be at least 4 characters long");
      }
    
      return errors;
    },
  
    validateLogin: ({  userName, password }: LoginPayload): string[] => {
      const errors: string[] = [];
  
      if (! userName) errors.push("userName is required");
      if (!password) errors.push("Password is required");
  
      return errors;
    },
  };
  