/// <reference lib="dom" />
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { server } from "./utils";

beforeAll(() => {
	server.listen({
		onUnhandledRequest: (request) => {
			throw new Error(
				`No request handler found for ${request.method} ${request.url}`,
			);
		},
	});
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

expect.extend(matchers);

afterEach(() => {
	cleanup();
});

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

// Mock @tanstack/router-devtools
vi.mock("@tanstack/router-devtools", () => ({
	TanStackRouterDevtools: () => null,
}));

// Mock @tanstack/react-query-devtools
vi.mock("@tanstack/react-query-devtool", () => ({
	ReactQueryDevtools: () => null,
}));
