import { ObjectLiteral, Repository } from "typeorm";

export function GetRelationsFrom<T extends ObjectLiteral>(
	repository: Repository<T>
) {
	const relations = repository.metadata.relations
		// .filter((relation) => relation.isManyToOne)
		.map((relation) => relation.propertyName);

	return relations;
}
