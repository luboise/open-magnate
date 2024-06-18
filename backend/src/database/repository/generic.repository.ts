import {
	DeepPartial,
	EntityManager,
	EntityTarget,
	FindOptionsWhere,
	ObjectLiteral,
	Repository
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { Logger } from "../../utils";

class DBRepository<T extends ObjectLiteral> {
	// class Controller<T extends EntityTarget<ObjectLiteral>> {
	private _entityManager: EntityManager;
	private _repository: Repository<T>;

	// type T = EntityTarget<K>;

	constructor(
		em: EntityManager,
		entityClass: EntityTarget<T>
	) {
		this._entityManager = em;
		this._repository =
			this._entityManager.getRepository(entityClass);

		// Get mapping function
	}

	public async getAll(): Promise<T[]> {
		try {
			const users = await this._repository.find();
			return users;
		} catch (error) {
			Logger.Error(error);
			return [];
		}
	}

	public async get(
		options: FindOptionsWhere<T>
	): Promise<T[] | null> {
		try {
			const user = await this._repository.find({
				where: options
			});
			return user;
		} catch (error) {
			Logger.Error(error);
		}

		return null;
	}

	public async getFirst(
		params: FindOptionsWhere<T>
	): Promise<T | null> {
		try {
			const user =
				await this._repository.findOneBy(params);
			return user;
		} catch (error) {
			Logger.Error(error);
		}

		return null;
	}

	public async create(
		object: DeepPartial<T>
	): Promise<T | null> {
		try {
			const parsedUser =
				this._repository.create(object);
			const newUser =
				await this._repository.save(parsedUser);
			return newUser;
		} catch (error) {
			Logger.Error(error);
		}

		return null;
	}
	public async update(
		id: FindOptionsWhere<T>,
		item: QueryDeepPartialEntity<T>
	): Promise<T | null> {
		try {
			const updateResult =
				await this._repository.update(id, item);
			if (updateResult.affected)
				return this._repository.findOneBy(id);
		} catch (error) {
			Logger.Error(error);
		}

		return null;
	}

	public async deleteRecord(
		id: FindOptionsWhere<T>
	): Promise<boolean> {
		try {
			const deleteResult =
				await this._repository.delete(id);
			return Boolean(deleteResult.affected);
		} catch (error) {
			Logger.Error(error);
		}
		return false;
	}

	public async size(): Promise<number | null> {
		try {
			const size = await this._repository.count();
			return size;
		} catch (error) {
			Logger.Error(error);
		}
		return null;
	}
}

export default DBRepository;
