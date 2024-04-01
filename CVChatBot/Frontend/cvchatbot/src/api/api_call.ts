import { GENERATE_TEXT } from "./endpoints";
import { axiosInstance } from "../utils/axios";

export const ask = async (question: string) => {
    const response = await axiosInstance.post(GENERATE_TEXT, { question });
    return response.data;
};

