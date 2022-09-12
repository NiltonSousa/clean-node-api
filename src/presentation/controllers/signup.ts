import { MissingParamError } from "../erros/missing-param-error";
import { badResquest } from "../helpers/http-helper";
import { HttpRequest, HttpResponse } from "../protocols/http";

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return badResquest(new MissingParamError("name"));
    }
    if (!httpRequest.body.email) {
      return badResquest(new MissingParamError("email"));
    }
  }
}
