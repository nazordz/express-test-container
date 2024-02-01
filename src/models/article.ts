import sequelize from "@/configs/sequelize";
import {
  InferCreationAttributes,
  DataTypes,
  InferAttributes,
  Model,
  CreationOptional,
} from "sequelize";

class Article extends Model<
  InferAttributes<Article>,
  InferCreationAttributes<Article>
> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare slug: string;
  declare content: string;
  declare author: string | null;
}

Article.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "articles",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Article;
