import { IsIn, IsOptional } from 'class-validator';


export class QueryMenusDto {
@IsOptional()
@IsIn(['breakfast', 'lunch'])
mealType?: 'breakfast' | 'lunch';
}