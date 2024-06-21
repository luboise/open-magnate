import express from "express";
import expressWs from "express-ws";

type ExpressModule = typeof express;
export type RouteHandler = (
	express: ExpressModule,
	app: expressWs.Application
) => void;
