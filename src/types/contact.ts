export interface ContactData {
  phoneNumbers?: Array<{
    label: string
    number: string
    isPrimary?: boolean | null
    id?: string | null
  }> | null
  whatsappNumber?: string | null
  socialLinks?: Array<{
    platform: string
    customPlatform?: string | null
    url: string
    isActive?: boolean | null
    id?: string | null
  }> | null
  emailAddresses?: Array<{
    label: string
    email: string
    isPrimary?: boolean | null
    id?: string | null
  }> | null
  businessAddress?: {
    name?: string | null
    street?: string | null
    city?: string | null
    postcode?: string | null
    country?: string | null
  } | null
}
