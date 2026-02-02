import { MessageCircle } from "lucide-react";

const WhatsAppChatButton = () => {
  const whatsappNumber = "254105575260";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-canadian-red hover:bg-canadian-red-deep text-white px-5 py-3 rounded-full shadow-lg hover:shadow-canadian transform hover:scale-105 transition-all duration-300 group"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 group-hover:animate-pulse" />
      <span className="font-semibold text-sm md:text-base">Talk to us</span>
    </a>
  );
};

export default WhatsAppChatButton;
