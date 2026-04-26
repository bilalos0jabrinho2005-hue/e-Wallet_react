import SideBar from "./sidebar";
import { useState, useEffect } from "react";

export default function MainSection2(props){
    const [user, setUser] = useState(props.userData || {});
    const [showTransferSection, setShowTransferSection] = useState(false);
    const [showRechargeSection, setShowRechargeSection] = useState(false);
    const [transferForm, setTransferForm] = useState({ beneficiary: "", sourceCard: "", amount: "" });
    const [rechargeForm, setRechargeForm] = useState({ sourceCard: "", amount: "" });
    const [isLoading, setIsLoading] = useState(false);
    
    // Update user when props change
    useEffect(() => {
        if (props.userData && props.userData.id) {
            setUser(props.userData);
        }
    }, [props.userData]);
    
    const wallet = user.wallet || {};
    const cards = wallet.cards || [];
    const transactions = wallet.transactions || [];
    const beneficiaries = wallet.beneficiaries || [];
    
    // Calculate income and expenses
    const income = transactions
        .filter(t => t.type === "credit")
        .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
        .filter(t => t.type === "debit")
        .reduce((sum, t) => sum + t.amount, 0);
    
    // Update sessionStorage when user changes
    useEffect(() => {
        if (user.id) {
            sessionStorage.setItem("currentUser", JSON.stringify(user));
        }
    }, [user]);

    // ============= TRANSFER FUNCTIONS =============
    async function checkUser(numcompte) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Find beneficiary by account number
                const beneficiary = beneficiaries.find(b => b.account === numcompte);
                if (beneficiary) {
                    resolve(beneficiary);
                } else {
                    reject("Bénéficiaire introuvable");
                }
            }, 2000);
        });
    };

    async function checkSolde(amount) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (user.wallet && user.wallet.balance >= amount) {
                    resolve("Solde suffisant");
                } else {
                    reject("Solde insuffisant");
                }
            }, 3000);
        });
    };

    async function updateSolde(amount) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = JSON.parse(JSON.stringify(user)); // Deep copy
                newUser.wallet.balance -= amount;
                setUser(newUser);
                resolve(newUser);
            }, 2000);
        });
    };

    async function addTransactions(updatedUser, beneficiary, amount) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = JSON.parse(JSON.stringify(updatedUser)); // Deep copy
                const debit = {
                    id: Date.now(),
                    type: "debit",
                    amount: amount,
                    date: new Date().toLocaleString(),
                    to: beneficiary.name
                };

                newUser.wallet.transactions.push(debit);
                setUser(newUser);
                resolve("Transaction enregistrée avec succès");
            }, 3000);
        });
    };

    async function transfer(beneficiaryAccount, amount) {
        setIsLoading(true);
        try {
            const beneficiary = await checkUser(beneficiaryAccount);
            console.log("Étape 1 : Destinataire trouvé —", beneficiary.name);
            
            await checkSolde(amount);
            console.log("Étape 2 : Solde OK");
            
            const updatedUser = await updateSolde(amount);
            console.log("Étape 3 : Solde mis à jour");
            
            await addTransactions(updatedUser, beneficiary, amount);
            console.log("Transfert réussi !");
            
            alert("Transfert effectué avec succès !");
            setShowTransferSection(false);
            setTransferForm({ beneficiary: "", sourceCard: "", amount: "" });
        } catch (error) {
            console.error("Erreur :", error);
            alert(`Erreur : ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    async function handleTransfer(e) {
        e.preventDefault();
        const { beneficiary, amount } = transferForm;

        if (!beneficiary) {
            alert("Veuillez choisir un bénéficiaire.");
            return;
        }
        if (!amount || amount <= 0) {
            alert("Veuillez entrer un montant valide.");
            return;
        }

        await transfer(beneficiary, Number(amount));
    };

    // ============= RECHARGE FUNCTIONS =============
    async function checkCard(cardNum) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const card = user.wallet.cards.find(c => String(c.numcards) === String(cardNum));
                if (card) {
                    resolve(card);
                } else {
                    reject("Carte non trouvée");
                }
            }, 2000);
        });
    };

    async function effectuerRecharge(amount, cardNum) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = JSON.parse(JSON.stringify(user)); // Deep copy
                const card = newUser.wallet.cards.find(c => String(c.numcards) === String(cardNum));
                if (card) {
                    card.balance += amount;
                    newUser.wallet.balance += amount;
                    setUser(newUser);
                }
                resolve("Recharge en succès");
            }, 2000);
        });
    };

    async function addRechargeTransaction(amount) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = JSON.parse(JSON.stringify(user)); // Deep copy
                const dateStr = new Date().toLocaleString();
                const transaction = {
                    id: Date.now(),
                    type: "credit",
                    amount: amount,
                    date: dateStr,
                    from: "Recharge",
                };
                newUser.wallet.transactions.push(transaction);
                setUser(newUser);
                resolve("Recharge transaction added");
            }, 2000);
        });
    };

    async function recharge(amount, cardNum) {
        setIsLoading(true);
        console.log("DÉBUT DE LA RECHARGE...");
        try {
            const card = await checkCard(cardNum);
            console.log("Étape 1: Carte trouvée -", card.type + "****" + card.numcards);
            
            const rechargeMessage = await effectuerRecharge(amount, cardNum);
            console.log("Étape 2:", rechargeMessage);
            
            const addTransactionMessage = await addRechargeTransaction(amount);
            console.log("Étape 3:", addTransactionMessage);
            
            console.log(`Recharge de ${amount} MAD réussie!`);
            alert(`Recharge de ${amount} MAD effectuée avec succès !`);
            setShowRechargeSection(false);
            setRechargeForm({ sourceCard: "", amount: "" });
        } catch (erreur) {
            console.error("Échec de la recharge :", erreur);
            alert(`Erreur : ${erreur}`);
        } finally {
            setIsLoading(false);
        }
    };

    async function handleRecharge(e) {
        e.preventDefault();
        const { sourceCard, amount } = rechargeForm;

        if (!sourceCard) {
            alert("Veuillez sélectionner une carte.");
            return;
        }
        if (!amount || amount <= 0) {
            alert("Veuillez entrer un montant valide.");
            return;
        }

        await recharge(Number(amount), sourceCard);
    };
    
    return(
    <>
    <main className="dashboard-main">
    <div className="dashboard-container">
      <SideBar userData={user}/>
      <div className="dashboard-content">        
        <section id="overview" className="dashboard-section active">
          <div className="section-header">
            <h2>Bonjour, <span>{user.name || "Guest"}</span> !</h2>
            <p className="date-display">{new Date().toLocaleDateString("fr-FR")}</p>
          </div>
          <div className="summary-cards">
            <div className="summary-card">
              <div className="card-icon blue">
                <i className="fas fa-wallet"></i>
              </div>
              <div className="card-details">
                <span className="card-label">Solde disponible</span>
                <span className="card-value">{wallet.balance || 0} {wallet.currency || "MAD"}</span>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon green">
                <i className="fas fa-arrow-up"></i>
              </div>
              <div className="card-details">
                <span className="card-label">Revenus </span>
                <span className="card-value">{income} {wallet.currency || "MAD"}</span>
              </div>
            </div>
            <div className="summary-card">
              <div className="card-icon red">
                <i className="fas fa-arrow-down"></i>
              </div>
              <div className="card-details">
                <span className="card-label">Dépenses </span>
                <span className="card-value">{expenses} {wallet.currency || "MAD"}</span>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon purple">
                <i className="fas fa-credit-card"></i>
              </div>
              <div className="card-details">
                <span className="card-label">Cartes actives</span>
                <span className="card-value">{cards.length}</span>
              </div>
            </div>
          </div>
        
          <div className="quick-actions">
            <h3>Actions rapides</h3>
            <div className="action-buttons">
              <button className="action-btn" onClick={() => setShowTransferSection(true)}>
                <i className="fas fa-paper-plane"></i>
                <span>Transférer</span>
              </button>
              <button className="action-btn" onClick={() => setShowRechargeSection(true)}>
                <i className="fas fa-plus-circle"></i>
                <span>Recharger</span>
              </button>
              <button className="action-btn">
                <i className="fas fa-hand-holding-usd"></i>
                <span>Demander</span>
              </button>
            </div>
          </div>
          <div className="recent-transactions">
            <div className="section-header">
              <h3>Transactions récentes</h3>
            </div>
            <div className="transactions-list" id="recentTransactionsList">
              {transactions.slice(0, 5).map((transaction, index) => (
                <div className="transaction-item" key={index}>
                  <div className="transaction-icon" style={{color: transaction.type === 'credit' ? '#4CAF50' : '#FF6B6B'}}>
                    <i className={`fas fa-arrow-${transaction.type === 'credit' ? 'down' : 'up'}`}></i>
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-description">{transaction.type === 'credit' ? `De: ${transaction.from}` : `À: ${transaction.to}`}</div>
                    <div className="transaction-date">{transaction.date}</div>
                  </div>
                  <div className="transaction-amount" style={{color: transaction.type === 'credit' ? '#4CAF50' : '#FF6B6B'}}>
                    {transaction.type === 'credit' ? '+' : '-'}{transaction.amount} {wallet.currency || "MAD"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="cards" className="dashboard-section">
          <div className="section-header">
            <h2>Mes cartes</h2>
            <button className="btn btn-secondary" id="addCardBtn">
              <i className="fas fa-plus"></i> Ajouter une carte
            </button>
          </div>

          <div className="cards-grid" id="cardsGrid">
            {cards.map((card, index) => (
              <div className="card-item" key={index}>
                <div className={`card-preview ${card.type}`}>
                  <div className="card-chip"></div>
                  <div className="card-number">{card.numcards}</div>
                  <div className="card-holder">{user.name || "Cardholder"}</div>
                  <div className="card-expiry">{card.expiry}</div>
                  <div className="card-type">{card.type.toUpperCase()}</div>
                </div>
                <div className="card-actions">
                  <button className="card-action" title="Définir par défaut">
                    <i className="fas fa-star"></i>
                  </button>
                  <button className="card-action" title="Geler la carte">
                    <i className="fas fa-snowflake"></i>
                  </button>
                  <button className="card-action" title="Supprimer">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
<section id="transfer-section" className={`transfer-section ${showTransferSection ? "" : "hidden"}`}>
  <div className="section-header">
    <h2>Effectuer un transfert</h2>
    <button className="btn btn-close" onClick={() => setShowTransferSection(false)}>
      <i className="fas fa-times"></i>
    </button>
  </div>
  
  <div className="transfer-container">
    <form className="transfer-form" onSubmit={handleTransfer}>
      <div className="form-group">
        <label htmlFor="beneficiary">
          <i className="fas fa-user"></i> Bénéficiaire
        </label>
        <select 
          id="beneficiary" 
          name="beneficiary" 
          required
          value={transferForm.beneficiary}
          onChange={(e) => setTransferForm({...transferForm, beneficiary: e.target.value})}
        >
          <option value="" disabled>Choisir un bénéficiaire</option>
          {beneficiaries.map((beneficiary) => (
            <option key={beneficiary.id} value={beneficiary.account}>{beneficiary.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="sourceCard">
          <i className="fas fa-credit-card"></i> Depuis ma carte
        </label>
        <select 
          id="sourceCard" 
          name="sourceCard" 
          required
          value={transferForm.sourceCard}
          onChange={(e) => setTransferForm({...transferForm, sourceCard: e.target.value})}
        >
          <option value="" disabled>Sélectionner une carte</option>
          {cards.map((card) => (
            <option key={card.numcards} value={card.numcards}>{card.type.toUpperCase()} - {card.numcards}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="amount">
          <i className="fas fa-euro-sign"></i> Montant
        </label>
        <div className="amount-input">
          <input 
            type="number" 
            id="amount" 
            name="amount" 
            min="1" 
            step="0.01" 
            placeholder="0.00" 
            required
            value={transferForm.amount}
            onChange={(e) => setTransferForm({...transferForm, amount: e.target.value})}
          />
          <span className="currency">MAD</span>
        </div>
      </div>

      <div className="form-options">
        <div className="checkbox-group">
          <input type="checkbox" id="saveBeneficiary" name="saveBeneficiary"/>
          <label htmlFor="saveBeneficiary">Enregistrer ce bénéficiaire</label>
        </div>
        
        <div className="checkbox-group">
          <input type="checkbox" id="instantTransfer" name="instantTransfer"/>
          <label htmlFor="instantTransfer">Transfert instantané <span className="fee-badge">+13.4 MAD</span></label>
        </div>
      </div>
      <div className="form-actions">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={() => setShowTransferSection(false)}
          disabled={isLoading}
        >
          Annuler
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLoading}
        >
          <i className="fas fa-paper-plane"></i> {isLoading ? "Transfert en cours..." : "Transférer"}
        </button>
      </div>
    </form>
    </div>
</section>
<section id="rechargePopup" className={`rechargeForm ${showRechargeSection ? "" : "hidden"}`}>
  <div className="popup-content">
    <div className="popup-header">
      <h2>Recharger votre compte</h2>
      <button className="btn-close" onClick={() => setShowRechargeSection(false)} type="button">
        <i className="fas fa-times"></i>
      </button>
    </div>
    <div className="popup-body">
      <form className="transfer-form" onSubmit={handleRecharge}>
        <div className="form-group">
          <label htmlFor="rechargeSourceCard">
            <i className="fas fa-credit-card"></i> Depuis ma carte
          </label>
          <select 
            id="rechargeSourceCard" 
            name="rechargeSourceCard" 
            required
            value={rechargeForm.sourceCard}
            onChange={(e) => setRechargeForm({...rechargeForm, sourceCard: e.target.value})}
          >
            <option value="" disabled>Sélectionner une carte</option>
            {cards.map((card) => (
              <option key={card.numcards} value={card.numcards}>{card.type.toUpperCase()} - {card.numcards}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="rechargeAmount">
            <i className="fas fa-coins"></i> Montant
          </label>
          <div className="amount-input">
            <input 
              type="number" 
              id="rechargeAmount" 
              name="rechargeAmount" 
              min="1" 
              step="0.01" 
              placeholder="0.00" 
              required
              value={rechargeForm.amount}
              onChange={(e) => setRechargeForm({...rechargeForm, amount: e.target.value})}
            />
            <span className="currency">MAD</span>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => setShowRechargeSection(false)}
            disabled={isLoading}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            <i className="fas fa-paper-plane"></i> {isLoading ? "Recharge en cours..." : "Recharger"}
          </button>
        </div>
      </form>
    </div>
  </div>
</section> 
</main>   
    </>    
    )
}