import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsString } from "class-validator";
import { Member } from "../business-members.schema";

export class BusinessMembersDto {
    @IsString()
    @IsNotEmpty()
    businessId: string;

    @IsNotEmpty()
    members: Member[];
}

export class UpdateBusinessMembersDto extends PartialType(BusinessMembersDto) {}