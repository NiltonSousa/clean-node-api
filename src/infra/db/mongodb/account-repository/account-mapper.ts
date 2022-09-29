import {
  AddAccountModel,
  AccountModel,
} from "../../../../presentation/controllers/signup/signup-protocols";

export const map = (
  accountData: AddAccountModel,
  resultAccount: any
): AccountModel => {
  return Object.assign({}, accountData, {
    id: resultAccount.insertedId.id.toString(),
  });
};
