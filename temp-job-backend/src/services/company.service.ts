import { SupabaseClient, User } from '@supabase/supabase-js';
import { supabaseServiceClient } from '../configs/db.config';
import { Company, CompanyType } from '../models/company.model';
import { Package } from '../models/package.model';
import subscriptionService, {
  SubscriptionService,
} from './subscription.service';

import packageService, { PackageService } from './package.service';

class CompanyService {
  private _COMPANY_TABLE = 'company';
  private _COMPANY_TYPE_TABLE = 'company_type';
  private _ADMIN_COMPANY_MANAGEMENT_COMPANY_LIST =
    'admin_company_management_company_list';

  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly subscriptionService: SubscriptionService,
    private readonly packageService: PackageService
  ) {
    if (!supabaseClient) throw new Error('Supabase client is required');
    if (!subscriptionService)
      throw new Error('Subscription service is required');
    if (!packageService) throw new Error('Package service is required');
  }

  async createNewCompany(
    companyInfo: Partial<Omit<Company, 'user_id'>> & { user_id: User['id'] }
  ): Promise<Company> {
    const { data, error } = await this.supabaseClient
      .from(this._COMPANY_TABLE)
      .insert(companyInfo)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async getCompanyInfoByUserId(userId: string): Promise<Company | null> {
    const { data, error } = await this.supabaseClient
      .from(this._COMPANY_TABLE)
      .select('*, packages(*)')
      .eq('user_id', userId)
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async getAllCompanies(): Promise<Company[]> {
    const { data, error } = await this.supabaseClient
      .from(this._COMPANY_TABLE)
      .select('*');

    if (error) throw new Error(error.message);

    return data;
  }

  async updateCompanyInfoByCompanyId(
    companyId: Company['id'],
    newInfo: Company
  ): Promise<Company> {
    const { data, error } = await this.supabaseClient
      .from(this._COMPANY_TABLE)
      .update(newInfo)
      .eq('id', companyId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async getCompanyListForAdmin() {
    const { data: companies, error } = await this.supabaseClient
      .from(this._ADMIN_COMPANY_MANAGEMENT_COMPANY_LIST)
      .select('*');

    if (error) throw new Error(error.message);

    return companies;
  }

  async assignPackageToCompany(
    companyId: Company['id'],
    packageId: Package['id']
  ): Promise<Company> {
    const packageInfo = await this.packageService.getPackageById(packageId);

    if (!packageInfo) throw new Error('ไม่พบแพ็คเก็จที่ต้องการกำหนด');

    const newSubscription =
      await this.subscriptionService.createNewSubscription(packageInfo);

    const { data, error } = await this.supabaseClient
      .from(this._COMPANY_TABLE)
      .update({ package_id: packageId, subscription_id: newSubscription.id })
      .eq('id', companyId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async getAllCompanyTypes() {
    const { data, error } = await this.supabaseClient
      .from(this._COMPANY_TYPE_TABLE)
      .select('*');

    if (error) throw new Error(error.message);

    return data;
  }

  async deleteCompanyTypeById(companyTypeId: CompanyType['id']) {
    const { data, error } = await this.supabaseClient
      .from(this._COMPANY_TYPE_TABLE)
      .delete()
      .eq('id', companyTypeId);

    if (error) throw new Error(error.message);

    return data;
  }

  async createNewCompanyType(companyType: CompanyType) {
    const { data, error } = await this.supabaseClient
      .from(this._COMPANY_TYPE_TABLE)
      .insert(companyType)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async updateCompanyTypeById(
    companyTypeId: CompanyType['id'],
    newInfo: CompanyType
  ) {
    const { data, error } = await this.supabaseClient
      .from(this._COMPANY_TYPE_TABLE)
      .update(newInfo)
      .eq('id', companyTypeId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  private async _getCompanyInfoByCompanyId(
    companyId: Company['id']
  ): Promise<Company> {
    const { data, error } = await this.supabaseClient
      .from(this._COMPANY_TABLE)
      .select('*')
      .eq('id', companyId)
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async incrementCompanyPoints(companyId: Company['id']) {
    const companyInfo = await this._getCompanyInfoByCompanyId(companyId);

    const currentPoints = companyInfo?.points ?? 0;

    const addedPoints = 1;

    if (!companyInfo) throw new Error('ไม่พบข้อมูลบริษัท');

    const { data, error } = await this.supabaseClient
      .from(this._COMPANY_TABLE)
      .update({ points: currentPoints + addedPoints })
      .eq('id', companyId);

    if (error) throw new Error(error.message);

    return data;
  }
}

const companyService = new CompanyService(
  supabaseServiceClient,
  subscriptionService,
  packageService
);

export default companyService;
