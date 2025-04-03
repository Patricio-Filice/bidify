import { Bid, User } from "@prisma/client";

export type BidDetails = Bid & {
    user: User;
  };