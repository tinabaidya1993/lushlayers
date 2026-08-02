import { CakeItem, CustomizationSelection, OrderFormDetails } from '@/types';

export const BOUTIQUE_WHATSAPP_NUMBER = '918768388868'; // Exact User Phone Number

/**
 * Builds a WhatsApp URL for directly ordering a specific catalog cake
 */
export function buildCakeInquiryWhatsAppUrl(cake: CakeItem, customNotes?: string, selectedWeight?: string, selectedPrice?: number): string {
  const priceVal = selectedPrice || cake?.priceStartingFrom || 0;
  const text = `Hello *Lush Layers* (Made With Love) 👋✨

I would like to place an inquiry for your signature cake:

🎂 *Cake:* ${cake.name}
✨ *Category:* ${cake.category.toUpperCase()}
💰 *Price:* ₹${priceVal.toLocaleString()}
👥 *Servings/Weight:* ${selectedWeight || cake.servings}
🍰 *Dietary:* ${cake.eggless ? '🌱 100% Eggless' : '🥚 Contains Egg'}
🍫 *Flavors:* ${cake.flavors ? cake.flavors.join(', ') : 'Signature'}

${customNotes ? `📝 *Notes/Date Preference:* ${customNotes}\n` : ''}
Could you please share availability and confirm details for this order?

Thank you! ❤️`;

  return `https://wa.me/${BOUTIQUE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Builds a WhatsApp URL for a complete One-Page Order Form submission
 */
export function buildOnePageOrderWhatsAppUrl(order: OrderFormDetails): string {
  const priceVal = order.selectedPrice || 0;
  const text = `✨ *LUSH LAYERS (MADE WITH LOVE) — CONFIRMED ORDER* ✨

👤 *Customer Name:* ${order.customerName}
📞 *Phone:* ${order.phoneNumber}
📍 *Delivery Address:* ${order.deliveryAddress}
📅 *Event Date:* ${order.deliveryDate}
⏰ *Delivery Time Slot:* ${order.deliveryTime}

🎂 *Cake Name:* ${order.cakeName} (${(order.cakeCategory || '').toUpperCase()})
⚖️ *Weight / Size:* ${order.selectedWeight}
💰 *Total Estimated Price:* ₹${priceVal.toLocaleString()}
🌱 *Dietary:* ${order.eggless ? '100% Eggless' : 'Contains Egg'}

🍫 *Selected Flavor:* ${order.selectedFlavor}
🔷 *Cake Shape:* ${order.selectedShape}
🎨 *Theme Color:* ${order.selectedThemeColor}
✍️ *Plaque Lettering:* "${order.cakeMessage || 'None'}"
${order.referenceFileName ? `📷 *Reference Image:* Attached (${order.referenceFileName})\n` : ''}${order.specialNotes ? `📝 *Special Instructions:* ${order.specialNotes}\n` : ''}
Please confirm availability for my date & send payment details. Thank you! ❤️💫`;

  return `https://wa.me/${BOUTIQUE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Builds a WhatsApp URL for a custom cake created via the Cake Customizer
 */
export function buildCustomCakeWhatsAppUrl(selection: CustomizationSelection): string {
  const toppingsList = selection.toppings.length > 0 ? selection.toppings.join(', ') : 'Minimalist / Standard Accent';

  const text = `Hello *Lush Layers* (Made With Love) ✨🎂

I have designed a custom cake on your website and would like to place a custom order query:

👑 *Occasion:* ${selection.occasion || 'Special Celebration'}
🍰 *Structure:* ${selection.tiers} Tier(s) | ${selection.shape.toUpperCase()} Shape (${selection.servings} Guests)
🍫 *Sponge Base:* ${selection.spongeFlavor}
🍯 *Gourmet Filling:* ${selection.fillingFlavor}
🎨 *Frosting Style:* ${selection.frostingStyle}
✨ *Color Palette:* ${selection.colorPalette}
🌸 *Decorative Accents:* ${toppingsList}
${selection.customMessage ? `✍️ *Custom Plaque Text:* "${selection.customMessage}"\n` : ''}${selection.deliveryDate ? `📅 *Preferred Date:* ${selection.deliveryDate}\n` : ''}${selection.referenceImageUrl ? `📷 *Reference Photo (Cloudinary):* ${selection.referenceImageUrl}\n` : ''}${selection.notes ? `📝 *Special Requests:* ${selection.notes}\n` : ''}
Please review my custom request and send me a price estimate and confirmation. Thank you! 💫`;

  return `https://wa.me/${BOUTIQUE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * General Boutique Inquiry Link
 */
export function buildGeneralInquiryWhatsAppUrl(message?: string): string {
  const defaultText = `Hello *Lush Layers* (Made With Love) 👋✨\n\nI am visiting your website and would love to consult with your head cake artist for a cake order query.`;
  const text = message ? message : defaultText;
  return `https://wa.me/${BOUTIQUE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
