import { Timestamp } from "cosmjs-types/google/protobuf/timestamp";
import { GenericAuthorization } from "cosmjs-types/cosmos/authz/v1beta1/authz";
import { MsgGrant } from "cosmjs-types/cosmos/authz/v1beta1/tx";
import { coins } from "@cosmjs/launchpad";
import { getKeplrFromWindow } from "./getKeplrFromWindow";
import { SigningStargateClient } from "./tempStargate/src";

const grantWithdrawReward = ({
  granter,
  duration,
  grantee,
}: {
  granter: string;
  duration: number;
  grantee: string;
}) => {
  const msgValue: MsgGrant = {
    granter,
    grantee,
    grant: {
      authorization: {
        typeUrl: "/cosmos.authz.v1beta1.GenericAuthorization",
        value: GenericAuthorization.encode(
          GenericAuthorization.fromPartial({
            msg: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
          })
        ).finish(),
      },
      expiration: numOfDaysToExpiration(duration),
    },
  };

  const msg = {
    typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
    value: msgValue,
  };
  // console.log("withdraw delegationReward msg", msg);
  return msg;
};

const numOfDaysToExpiration = (numOfDays: number): Timestamp => {
  const dateNow = new Date();
  const dateIn2Years = new Date(dateNow.getTime() + numOfDays);
  const timeMS = dateIn2Years.getTime();

  return Timestamp.fromPartial({
    seconds: timeMS / 1000,
    nanos: (timeMS % 1000) * 1e6,
  });
};

const grantee = "osmo1f49xq0rmah39sk58aaxq6gnqcvupee7jkk4y6a";
const chainId = "osmosis-1";

export const grantDemo = async () => {
  const keplr = await getKeplrFromWindow();

  const offlineSigner = await keplr.getOfflineSignerAuto(chainId);

  const account = (await offlineSigner.getAccounts())?.[0];
  const key = await keplr.getKey(chainId);
  const client = await SigningStargateClient.connectWithSigner(
    "https://rpc.cosmos.directory/osmosis",
    offlineSigner
  );

  const fee = {
    amount: coins(200_000, "uosmo"), //stakeAmount
    gas: "300000",
  };

  const res = await client.signAndBroadcast(
    account.address,
    [
      grantWithdrawReward({
        granter: key.bech32Address,
        grantee,
        duration: new Date("9/4/2023").getTime() - new Date().getTime(),
      }),
    ],
    fee,
    "Testing Ledger"
  );

  console.log("response", res);
  alert("success");
};
