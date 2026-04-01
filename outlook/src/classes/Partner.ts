import Company from './Company';
import EnrichmentInfo from './EnrichmentInfo';
import Lead from './Lead';
import HelpdeskTicket from './HelpdeskTicket';
import Task from './Task';
import SaleOrder from './SaleOrder';
import PurchaseOrder from './PurchaseOrder';

/***
 * id value for partners which have not been yet added to a Odoo database
 */
const ID_PARTNER_NOT_FROM_DATABASE: number = -1;

class Partner {
    id: number;
    name: string;
    title: string; // job title
    phone: string;
    mobile: string;
    email: string;
    company: Company;
    image: string;
    enrichmentInfo: EnrichmentInfo;
    created: boolean;
    leads?: Lead[];
    tasks?: Task[];
    tickets?: HelpdeskTicket[];
    saleOrders?: SaleOrder[];
    purchaseOrders?: PurchaseOrder[];
    isCompany: boolean;
    canWriteOnPartner: boolean;

    constructor() {
        this.id = ID_PARTNER_NOT_FROM_DATABASE;
        this.name = '';
        this.title = '';
        this.phone = '';
        this.mobile = '';
        this.email = '';
        this.company = new Company();
        this.image = '';
        this.enrichmentInfo = new EnrichmentInfo();
        this.created = false;
        this.isCompany = false;
        this.canWriteOnPartner = true;
    }

    static createNewPartnerFromEmail = (name: string, email: string): Partner => {
        const partner = new Partner();
        partner.name = name;
        partner.email = email;
        return partner;
    };

    static fromJSON(o: Object): Partner {
        if (!o) return new Partner();
        const partner = Object.assign(new Partner(), o);
        partner.company = Company.fromJSON(o['company']);
        partner.enrichmentInfo = EnrichmentInfo.fromJSON(o['enrichment_info']);
        partner.isCompany = o['is_company'];
        partner.canWriteOnPartner = o['can_write_on_partner'] !== false;
        return partner;
    }

    static sortBestMatches(email: string, name: string, partners: Partner[]): Partner[] {
        return partners.sort((p1, p2) => {
            if (p1.email === email && (p2.email !== email || p1.name == name)) {
                return -1;
            } else {
                return 1;
            }
        });
    }

    getInitials(): string {
        const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
        const initials = [...this.name.matchAll(rgx)] || [];
        return ((initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')).toUpperCase();
    }

    isAddedToDatabase(): boolean {
        return this.id && this.id > 0;
    }
}

export default Partner;
