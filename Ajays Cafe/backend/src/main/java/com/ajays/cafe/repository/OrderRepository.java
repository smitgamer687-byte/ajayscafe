package com.ajays.cafe.repository;

import com.ajays.cafe.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatusOrderByOrderDateDesc(String status);
    List<Order> findAllByOrderByOrderDateDesc();
}