import * as React from 'react';
import Partner from '../../../classes/Partner';
import AppContext from '../AppContext';
import PurchaseOrder from '../../../classes/PurchaseOrder';
import { _t } from '../../../utils/Translator';
import { TextField } from 'office-ui-fabric-react';
import CollapseSection from '../CollapseSection/CollapseSection';
import ListItem from '../ListItem/ListItem';

type PurchaseOrderSectionProps = {
    partner: Partner;
    canCreatePartner: boolean;
};

type SectionPurchaseOrdersState = {
    purchaseOrders: PurchaseOrder[];
    filteredOrders: PurchaseOrder[];
    searchQuery: string;
    isCollapsed: boolean;
};

class SectionPurchaseOrders extends React.Component<PurchaseOrderSectionProps, SectionPurchaseOrdersState> {
    constructor(props, context) {
        super(props, context);
        const purchaseOrders = this.props.partner.purchaseOrders || [];
        this.state = {
            purchaseOrders: purchaseOrders,
            filteredOrders: purchaseOrders,
            searchQuery: '',
            isCollapsed: purchaseOrders.length === 0,
        };
    }

    private onSearchChange = (_ev, value: string) => {
        const query = value ? value.toLowerCase() : '';
        const filtered = this.state.purchaseOrders.filter(
            (order) => order.name.toLowerCase().includes(query)
        );
        this.setState({ searchQuery: value || '', filteredOrders: filtered });
    };

    private getPurchaseOrderDescription = (order: PurchaseOrder): string => {
        return _t('%(amount_total)s - %(state)s', {
            amount_total: order.amountTotal,
            state: order.state,
        });
    };

    private getContent = () => {
        const { partner, canCreatePartner } = this.props;
        const { filteredOrders, purchaseOrders } = this.state;

        if (!partner.isAddedToDatabase()) {
            return (
                <div className="list-text">
                    {_t(canCreatePartner
                        ? 'Save Contact to create new Purchase Orders.'
                        : 'The Contact needs to exist to create a Purchase Order.'
                    )}
                </div>
            );
        }

        return (
            <div>
                {purchaseOrders.length > 0 && (
                    <div style={{ padding: '4px 12px 8px 12px' }}>
                        <TextField
                            placeholder={_t('Search purchase order...')}
                            value={this.state.searchQuery}
                            onChange={this.onSearchChange}
                            iconProps={{ iconName: 'Search' }}
                        />
                    </div>
                )}
                {filteredOrders.length > 0 ? (
                    <div className="section-content">
                        {filteredOrders.map((order) => (
                            <ListItem
                                model="purchase.order"
                                res_id={order.id}
                                key={order.id}
                                title={order.name}
                                description={this.getPurchaseOrderDescription(order)}
                                logTitle={_t('Log Email Into Purchase Order')}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="list-text">
                        {_t('No purchase orders found for this contact.')}
                    </div>
                )}
            </div>
        );
    };

    render() {
        const { purchaseOrders } = this.state;
        const recordCount = purchaseOrders.length;
        const title = _t('Purchase Orders (%(count)s)', { count: recordCount.toString() });

        return (
            <CollapseSection
                isCollapsed={this.state.isCollapsed}
                title={title}
                hasAddButton={false}
                onAddButtonClick={() => {}}>
                {this.getContent()}
            </CollapseSection>
        );
    }
}

SectionPurchaseOrders.contextType = AppContext;

export default SectionPurchaseOrders;
