export default function BusinessHeader({ bizInfo }) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="business-header"
      >
        <div className="business-logo">
          {bizInfo?.logo ? (
            <img src={bizInfo.logo} alt="Business Logo" />
          ) : (
            <div className="logo-placeholder">
              {bizInfo?.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="business-info">
          <h2 className="business-name">{bizInfo?.name || 'Unknown Business'}</h2>
          <p className="business-id">ID: {bizInfo?.id}</p>
        </div>
      </motion.div>
    );
  }