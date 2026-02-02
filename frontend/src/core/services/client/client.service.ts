import { api } from "@shared/services/api/api";
import type { Client } from "@types";
import type { RegisterInterface } from "./interfaces";
import { ClientControllerName, ClientRoutes } from "@shared/constants/client-routes.constants";

export const clientService = {
    register: async (data: RegisterInterface) => {
        const response = await api.post<{ data: Client }>(`${ClientControllerName}${ClientRoutes.REGISTER}`, data);
        return response.data as unknown as Client;
    },
};
