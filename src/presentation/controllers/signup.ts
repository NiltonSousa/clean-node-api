import { MissingParamError } from "../erros/missing-param-error";
import { badResquest } from "../helpers/http-helper";
import { HttpRequest, HttpResponse } from "../protocols/http";

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ["name", "email"];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badResquest(new MissingParamError(field));
      }
    }
  }
}
