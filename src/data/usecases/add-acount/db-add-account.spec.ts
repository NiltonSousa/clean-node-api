import { DbAddAccount } from "./db-add-account";
import {
  AddAccountModel,
  Encrypter,
  AccountModel,
  AddAccountRepository,
} from "./db-add-account-protocols";

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeEncrypter = () => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }

  return new EncrypterStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_mail@mail.com",
        password: "hashed_password",
      };
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }

  return new AddAccountRepositoryStub();
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();

  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

  return { encrypterStub, sut, addAccountRepositoryStub };
};

describe("DbAddAccount Usecase", () => {
  it("Should call Encrypter with correct password", async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    const accountData = {
      name: "valid_name",
      email: "valid_mail@mail.com",
      password: "valid_pass",
    };

    await sut.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith("valid_pass");
  });

  it("Should throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();

    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const accountData = {
      name: "valid_name",
      email: "valid_mail@mail.com",
      password: "valid_pass",
    };

    const promise = sut.add(accountData);

    await expect(promise).rejects.toThrow();
  });

  it("Should throw if AddACcountRepository throws", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();

    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const accountData = {
      name: "valid_name",
      email: "valid_mail@mail.com",
      password: "valid_pass",
    };

    const promise = sut.add(accountData);

    await expect(promise).rejects.toThrow();
  });

  it("Should call AddAccountRepository with correct data", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();

    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");

    const accountData = {
      name: "valid_name",
      email: "valid_mail@mail.com",
      password: "valid_pass",
    };

    await sut.add(accountData);

    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_mail@mail.com",
      password: "hashed_password",
    });
  });

  it("Should return an account when success", async () => {
    const { sut } = makeSut();

    const accountData = {
      name: "valid_name",
      email: "valid_mail@mail.com",
      password: "valid_pass",
    };

    const account = await sut.add(accountData);

    expect(account).toEqual({
      id: "valid_id",
      name: "valid_name",
      email: "valid_mail@mail.com",
      password: "hashed_password",
    });
  });
});
