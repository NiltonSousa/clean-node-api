import bcrypt from "bcrypt";
import { BCryptAdapter } from "./bcrypt-adapter";

describe("BCrypt Adapter", () => {
  it("Should call bcrypt with correct value", async () => {
    const sut = new BCryptAdapter(12);
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("any_value");

    expect(hashSpy).toHaveBeenCalledWith("any_value", 12);
  });
});
