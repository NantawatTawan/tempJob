
-- สร้าง ENUM สำหรับสิทธิ์ผู้ใช้งาน
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- สร้างตาราง USER
CREATE TABLE "user" ( -- Use quotes around "user" as it's a reserved keyword
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'user' -- Default to 'user' role
);

-- สร้างตาราง JOB
CREATE TABLE IF NOT EXISTS job (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_type_id INT,
    description TEXT,
    hire_type VARCHAR(255),
    wage NUMERIC,
    site VARCHAR(255),
    province VARCHAR(255),
    district VARCHAR(255),
    company_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expired_at TIMESTAMPTZ
);

-- สร้างตาราง COMPANY
CREATE TABLE IF NOT EXISTS company (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- Assuming user_id references another table
    company_name VARCHAR(255),
    company_type COMPANY_TYPES,
    additional_info TEXT,
    address VARCHAR(255),
    province VARCHAR(255),
    district VARCHAR(255),
    sub_district VARCHAR(255),
    zip_code VARCHAR(10), -- Adjust length as needed
    company_contact_person_name VARCHAR(255),
    company_phone_number VARCHAR(20), -- Adjust length as needed
    company_email VARCHAR(255),
    transportation_guide TEXT,
    company_location_map_url TEXT,
    welfare TEXT,
    tax_no VARCHAR(20), -- Adjust length as needed
    package_id INTEGER, -- Assuming package_id references another table
    subscription_id INTEGER -- Assuming subscription_id references another table
);

-- สร้างตาราง JOB_TYPES
CREATE TABLE IF NOT EXISTS job_types (
    id SERIAL PRIMARY KEY, -- SERIAL automatically generates sequential integers
    title VARCHAR(255) NOT NULL,
    description TEXT
);

-- สร้างตาราง JOB_VIEWED
CREATE TABLE IF NOT EXISTS job_viewed (
    job_id UUID,
    user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (job_id, user_id) -- Composite primary key
);

-- สร้างตาราง JOB_APPLICATION
CREATE TABLE IF NOT EXISTS job_application (
    job_id UUID,
    freelancer_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (job_id, freelancer_id) -- Composite primary key
);