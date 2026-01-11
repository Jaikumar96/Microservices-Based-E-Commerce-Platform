package com.ecommerce.Notification.Service.service;

import com.ecommerce.Notification.Service.event.OrderPlacedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationService {

    @KafkaListener(topics = "notificationTopic", groupId = "notificationId")
    public void handleNotification(OrderPlacedEvent orderPlacedEvent) {
        // Send email notification (we'll simulate it with logging)
        log.info("========================================");
        log.info("📧 NOTIFICATION SENT!");
        log.info("Order Number: {}", orderPlacedEvent.getOrderNumber());
        log.info("Email sent to customer about order placement");
        log.info("========================================");

        // In real implementation, you would use JavaMailSender here
        // Example:
        // mailSender.send(prepareEmail(orderPlacedEvent));
    }
}
