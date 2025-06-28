
export interface iFeaturedShops extends Document {
    _id: Schema.Types.ObjectId;
    shop: Schema.Types.ObjectId;
    shopId?: string;
    title: string;
    description: string;
    status: "active" | "inactive";
    createdAt?: Date;
    updatedAt?: Date;
}
