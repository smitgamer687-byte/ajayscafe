package com.ajays.cafe.service;

import com.ajays.cafe.model.MenuItem;
import com.ajays.cafe.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MenuService {
    
    @Autowired
    private MenuRepository menuRepository;
    
    public List<MenuItem> getAllMenuItems() {
        return menuRepository.findAll();
    }
    
    public Optional<MenuItem> getMenuItemById(Long id) {
        return menuRepository.findById(id);
    }
    
    public MenuItem createMenuItem(MenuItem menuItem) {
        return menuRepository.save(menuItem);
    }
    
    public MenuItem updateMenuItem(Long id, MenuItem menuItem) {
        if (menuRepository.existsById(id)) {
            menuItem.setId(id);
            return menuRepository.save(menuItem);
        }
        throw new RuntimeException("Menu item not found");
    }
    
    public void deleteMenuItem(Long id) {
        menuRepository.deleteById(id);
    }
    
    public List<MenuItem> getMenuItemsByCategory(String category) {
        return menuRepository.findByCategory(category);
    }
    
    public List<MenuItem> getPopularItems() {
        return menuRepository.findByPopular(true);
    }
}