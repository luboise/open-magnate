import express, { Express } from "express";

type ExpressModule = typeof express;
export type RouteHandler = (
	express: ExpressModule,
	app: Express
) => void;
