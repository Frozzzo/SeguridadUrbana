import React from 'react';
import './EmergencyContacts.css';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: string;
  available24h: boolean;
}

interface Props {
  contacts: EmergencyContact[];
}

const EmergencyContacts: React.FC<Props> = ({ contacts }) => {
  const getContactIcon = (type: string) => {
    switch (type) {
      case 'police':
        return '👮';
      case 'fire':
        return '🚒';
      case 'medical':
        return '🚑';
      case 'security':
        return '🛡️';
      default:
        return '📞';
    }
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="emergency-contacts card">
      <div className="contacts-header">
        <h3>Contactos de Emergencia</h3>
      </div>

      <div className="contacts-list">
        {contacts.map((contact) => (
          <div key={contact.id} className="contact-item">
            <div className="contact-icon">{getContactIcon(contact.type)}</div>
            <div className="contact-info">
              <div className="contact-name">{contact.name}</div>
              <div className="contact-phone text-muted">{contact.phone}</div>
              {contact.available24h && (
                <span className="badge badge-success">24/7</span>
              )}
            </div>
            <button
              className="btn btn-success btn-sm btn-call"
              onClick={() => handleCall(contact.phone)}
            >
              📞 Llamar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyContacts;
