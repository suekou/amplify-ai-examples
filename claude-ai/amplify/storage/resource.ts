import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "sample-storage",

  access: (allow) => ({
    "rag-resources/*": [allow.authenticated.to(["read", "write", "delete"])],
  }),
});
