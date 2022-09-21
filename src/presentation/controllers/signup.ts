import { AddAccount } from "../../domain/usecases/add-account";
import { MissingParamError, InvalidParamError } from "../errors/index";
import { badResquest, serverError } from "../helpers/http-helper";
import {
  HttpRequest,
  HttpResponse,
  EmailValidator,
  Controller,
} from "../protocols/index";

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badResquest(new MissingParamError(field));
        }
      }

      const { name, password, passwordConfirmation, email } = httpRequest.body;

      if (passwordConfirmation != password) {
        return badResquest(new InvalidParamError("passwordConfirmation"));
      }

      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badResquest(new InvalidParamError("email"));
      }
      this.addAccount.add({
        name,
        email,
        password,
      });
    } catch (error) {
      return serverError();
    }
  }
}
