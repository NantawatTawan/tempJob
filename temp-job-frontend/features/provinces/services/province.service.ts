import axios from "axios";
import { Province } from "../schemas/province.schema";

class ProvinceService {
  private readonly _BASE_URL =
    "/provinces.json";

  async getAllProvinces(): Promise<Province[]> {
    const { data: provinces } = await axios.get(this._BASE_URL);
    return provinces;
  }
}

export const provinceService = new ProvinceService();
