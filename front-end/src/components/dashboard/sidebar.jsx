export default function SideBar(){
    return(
        <>
        <aside className="dashboard-sidebar">
        <nav className="sidebar-nav">
          <ul>
            <li className="active">
              <a href="#overview">
                <i className="fas fa-home"></i>
                <span>Vue d'ensemble</span>
              </a>
            </li>
            <li>
              <a href="#transactions">
                <i className="fas fa-exchange-alt"></i>
                <span>Transactions</span>
              </a>
            </li>
            <li>
              <a href="#cards">
                <i className="fas fa-credit-card"></i>
                <span>Mes cartes</span>
              </a>
            </li>
            <li>
              <a href="#transfers">
                <i className="fas fa-paper-plane"></i>
                <span>Transferts</span>
              </a>
            </li>
            <li className="separator"></li>
            <li>
              <a href="#support">
                <i className="fas fa-headset"></i>
                <span>Aide & Support</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>
        </>
    )
}