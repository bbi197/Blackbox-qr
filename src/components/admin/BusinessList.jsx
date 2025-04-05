import { mockDB } from '../utils/mockDB';

const BusinessList = ({ onSelect }) => {
  const businesses = mockDB.businesses;

  return (
    <div className="business-list-container">
      <h3 className="section-title">Registered Businesses</h3>
      
      {businesses.length === 0 ? (
        <p className="empty-state">No businesses registered yet</p>
      ) : (
        <div className="business-grid">
          {businesses.map((business) => (
            <div 
              key={business.id}
              className="business-card"
              onClick={() => onSelect(business)}
            >
              <div className="business-header">
                <span className="business-id">{business.id}</span>
                <span className="commission-badge">
                  {business.commissionRate}% Commission
                </span>
              </div>
              <h4 className="business-name">{business.name}</h4>
              <div className="business-stats">
                <div className="stat-item">
                  <span className="stat-label">Balance</span>
                  <span className="stat-value">
                    KES {business.balance?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Transactions</span>
                  <span className="stat-value">
                    {business.transactions?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessList;