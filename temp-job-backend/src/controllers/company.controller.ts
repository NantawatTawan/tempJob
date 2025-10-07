import { Request, Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { isUserAdmin } from "../helpers/user-info.helper";
import companyService from "../services/company.service";
import userInfoService from "../services/user-info.service";

export async function getAllCompanies(req: Request, res: Response) {
  try {
    // TODO : Only allow admin to access this endpoint

    const companies = await companyService.getAllCompanies();

    res.status(StatusCodes.OK).json({
      data: companies,
      message: getReasonPhrase(StatusCodes.OK),
    });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถดึงข้อมูลบริษัทได้ -> ${error.message}`);
  }
}

export async function updateCompanyInfoByCompanyId(
  req: Request,
  res: Response
) {
  try {
    const user = res.locals.user;

    const companyId = req.params.companyId;

    const newCompanyInfo = req.body.newCompanyInfo;

    const userInfo = await userInfoService.getUserInfoByUserId(user.sub);

    if (!userInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ไม่พบข้อมูลผู้ใช้งาน",
      });
      return;
    }

    if (!newCompanyInfo) {
      res.status(StatusCodes.BAD_REQUEST).json({
        data: null,
        message: getReasonPhrase(StatusCodes.BAD_REQUEST),
      });
      return;
    }

    if (!companyId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        data: null,
        message: getReasonPhrase(StatusCodes.BAD_REQUEST),
      });
    }

    const companyInfo = await companyService.getCompanyInfoByUserId(user.sub);

    if (!companyInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: getReasonPhrase(StatusCodes.NOT_FOUND),
      });
      return;
    }

    const isUserTheOwnerOfTheCompany = companyInfo.id === companyId;

    if (!isUserTheOwnerOfTheCompany && !isUserAdmin(userInfo)) {
      res.status(StatusCodes.FORBIDDEN).json({
        data: null,
        message: "คุณไม่มีสิทธิในการเข้าถึงข้อมูลนี้",
      });
      return;
    }

    const updatedCompanyInfo =
      await companyService.updateCompanyInfoByCompanyId(
        companyInfo.id,
        newCompanyInfo
      );

    res.status(StatusCodes.OK).json({
      data: updatedCompanyInfo,
      message: getReasonPhrase(StatusCodes.OK),
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถอัพเดตข้อมูลบริษัทได้ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
}

export async function getCompanyDetailByUserId(req: Request, res: Response) {
  try {
    const user = res.locals.user;

    const companyInfo = await companyService.getCompanyInfoByUserId(user.sub);

    if (!companyInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: getReasonPhrase(StatusCodes.NOT_FOUND),
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      data: companyInfo,
      message: getReasonPhrase(StatusCodes.OK),
    });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถดึงข้อมูลบริษัทได้ -> ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
}

export async function assignPackageToCompany(req: Request, res: Response) {
  try {
    const { companyId, packageId } = req.params;

    await companyService.assignPackageToCompany(companyId, parseInt(packageId));

    res.status(StatusCodes.OK).json({
      data: null,
      message: "กำหนดแพ็คเก็จให้บริษัทเรียบร้อย",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถกำหนดแพ็คเก็จให้บริษัทได้ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
}

export async function getAllCompanyTypes(req: Request, res: Response) {
  try {
    const companyTypes = await companyService.getAllCompanyTypes();

    res.status(StatusCodes.OK).json({
      data: companyTypes,
      message: "ดึงข้อมูลประเภทบริษัทเรียบร้อย",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถดึงข้อมูลประเภทบริษัทได้ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
}

export async function createNewCompanyType(req: Request, res: Response) {
  try {
    const companyType = req.body.companyType;

    const newCompanyType = await companyService.createNewCompanyType(
      companyType
    );

    res.status(StatusCodes.OK).json({
      data: newCompanyType,
      message: "สร้างประเภทบริษัทเรียบร้อย",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถสร้างประเภทบริษัทได้ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
}

export async function updateCompanyTypeById(req: Request, res: Response) {
  try {
    const { companyTypeId } = req.params;

    const newCompanyType = req.body.newCompanyType;

    const updatedCompanyType = await companyService.updateCompanyTypeById(
      parseInt(companyTypeId),
      newCompanyType
    );

    if (!updatedCompanyType) {
      res.status(StatusCodes.NOT_FOUND).json({
        data: null,
        message: "ไม่พบข้อมูลประเภทบริษัท",
      });
      return;
    }

    console.log(
      `[INFO] : อัพเดตประเภทบริษัทเรียบร้อย -> ${updatedCompanyType}`
    );

    res.status(StatusCodes.OK).json({
      data: updatedCompanyType,
      message: "อัพเดตประเภทบริษัทเรียบร้อย",
    });
  } catch (error: any) {
    console.error(
      `[ERROR] : ไม่สามารถอัพเดตประเภทบริษัทได้ -> ${error.message}`
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
}

export async function deleteCompanyTypeById(req: Request, res: Response) {
  try {
    const { companyTypeId } = req.params;

    const deletedCompanyType = await companyService.deleteCompanyTypeById(
      parseInt(companyTypeId)
    );

    console.log(`[INFO] : ลบประเภทบริษัทเรียบร้อย -> ${deletedCompanyType}`);

    res.status(StatusCodes.OK).json({
      data: deletedCompanyType,
      message: "ลบประเภทบริษัทเรียบร้อย",
    });
  } catch (error: any) {
    console.error(`[ERROR] : ไม่สามารถลบประเภทบริษัทได้ -> ${error.message}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      data: null,
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
}
