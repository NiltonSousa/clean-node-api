import bcrypt from "bcrypt";
import { BCryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hash"));
  },
}));

describe("BCrypt Adapter", () => {
  it("Should call bcrypt with correct value", async () => {
    const sut = new BCryptAdapter(12);
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("any_value");

    expect(hashSpy).toHaveBeenCalledWith("any_value", 12);
  });

  it("Should call a hash on success", async () => {
    const sut = new BCryptAdapter(12);
    const hash = await sut.encrypt("any_value");

    expect(hash).toBe("hash");
  });
});
