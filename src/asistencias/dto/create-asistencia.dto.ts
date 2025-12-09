import { IsInt, IsOptional, IsBoolean } from 'class-validator';

export class UpdateAttendanceDto {
  @IsOptional() @IsInt() sessionId?: number;
  @IsOptional() @IsInt() studentId?: number;
  @IsOptional() @IsBoolean() present?: boolean;
}
