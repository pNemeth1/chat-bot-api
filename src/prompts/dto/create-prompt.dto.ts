import { IsNotEmpty, IsString } from "class-validator";

export class CreatePromptDto {
  @IsNotEmpty()
  @IsString()
  user_query: string;
}
