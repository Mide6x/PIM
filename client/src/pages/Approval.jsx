import Sidebar from "./sidebar/Sidebar";

const Approval = () => {
  return (
    <div className="container">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="content">
        <div>
          <h2>Product Approval ✅</h2>
          <p className="spaced">
            From here, you can approve and edit products before pushing to the
            database.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Approval;
