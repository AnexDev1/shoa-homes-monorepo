import { create } from 'zustand';

export const useModalStore = create((set) => ({
  isInquiryModalOpen: false,
  selectedProperty: null,
  
  openInquiryModal: (property) => {
    set({ isInquiryModalOpen: true, selectedProperty: property });
  },
  
  closeInquiryModal: () => {
    set({ isInquiryModalOpen: false, selectedProperty: null });
  },
}));
