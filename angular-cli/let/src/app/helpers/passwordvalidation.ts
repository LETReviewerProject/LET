
import { AbstractControl } from '@angular/forms';
export class PasswordValidation {

   static MatchPassword(c: AbstractControl) {
      let password = c.get('password').value; // to get value in input tag
      let confirmPassword = c.get('confirmPassword').value; // to get value in input tag
      if (password != confirmPassword) {
         c.get('confirmPassword').setErrors({ MatchPassword: true })

      } else {
         return null
      }
   }


}