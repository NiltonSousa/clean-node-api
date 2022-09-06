import { SignUpController } from "./signup";

describe("Sign Up Controller", () => {
  it("Should return 400 if no name is provided", () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        // name:"any_name", removing name for the test
        email: "email@mail.com",
        password: "any_pass",
        passwordConfirmation: "any_pass",
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error("Missing name param"));
  });
});
