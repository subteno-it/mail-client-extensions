import * as React from 'react';
import Partner from '../../../classes/Partner';
import AppContext from '../AppContext';
import SaleOrder from '../../../classes/SaleOrder';
import { _t } from '../../../utils/Translator';
import { TextField } from 'office-ui-fabric-react';
import CollapseSection from '../CollapseSection/CollapseSection';
import ListItem from '../ListItem/ListItem';

type SaleOrderSectionProps = {
    partner: Partner;
    canCreatePartner: boolean;
};

type SectionSaleOrdersState = {
    saleOrders: SaleOrder[];
    filteredOrders: SaleOrder[];
    searchQuery: string;
    isCollapsed: boolean;
};

class SectionSaleOrders extends React.Component<SaleOrderSectionProps, SectionSaleOrdersState> {
    constructor(props, context) {
        super(props, context);
        const saleOrders = this.props.partner.saleOrders || [];
        console.log('🛒 [SectionSaleOrders] constructor, saleOrders:', saleOrders);
        this.state = {
            saleOrders: saleOrders,
            filteredOrders: saleOrders,
            searchQuery: '',
            isCollapsed: saleOrders.length === 0,
        };
    }

    private onSearchChange = (_ev, value: string) => {
        const query = value ? value.toLowerCase() : '';
        const filtered = this.state.saleOrders.filter(
            (order) => order.name.toLowerCase().includes(query)
        );
        this.setState({ searchQuery: value || '', filteredOrders: filtered });
    };

    private getSaleOrderDescription = (order: SaleOrder): string => {
        return _t('%(amount_total)s - %(state)s', {
            amount_total: order.amountTotal,
            state: order.state,
        });
    };

    private getContent = () => {
        const { partner, canCreatePartner } = this.props;
        const { filteredOrders, saleOrders } = this.state;

        if (!partner.isAddedToDatabase()) {
            return (
                <div className="list-text">
                    {_t(canCreatePartner
                        ? 'Save Contact to create new Sale Orders.'
                        : 'The Contact needs to exist to create a Sale Order.'
                    )}
                </div>
            );
        }

        return (
            <div>
                {saleOrders.length > 0 && (
                    <div style={{ padding: '4px 12px 8px 12px' }}>
                        <TextField
                            placeholder={_t('Search order...')}
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
                                model="sale.order"
                                res_id={order.id}
                                key={order.id}
                                title={order.name}
                                description={this.getSaleOrderDescription(order)}
                                logTitle={_t('Log Email Into Sale Order')}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="list-text">
                        {_t('No sale orders found for this contact.')}
                    </div>
                )}
            </div>
        );
    };

    render() {
        const { saleOrders } = this.state;
        const recordCount = saleOrders.length;
        const title = _t('Sale Orders (%(count)s)', { count: recordCount.toString() });

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

SectionSaleOrders.contextType = AppContext;

export default SectionSaleOrders;