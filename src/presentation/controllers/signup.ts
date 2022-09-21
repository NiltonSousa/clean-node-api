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

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
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

      if (httpRequest.body.passwordConfirmation != httpRequest.body.password) {
        return badResquest(new InvalidParamError("passwordConfirmation"));
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!isValid) {
        return badResquest(new InvalidParamError("email"));
      }
    } catch (error) {
      return serverError();
    }
  }
}
