package com.example.ecommerce.util;

import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.ProductImage;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.repository.ProductImageRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class ProductSeeder implements CommandLineRunner {

    private final ProductRepository productRepo;
    private final ProductImageRepository imageRepo;
    private final UserRepository userRepo;

    @Override
    public void run(String... args) {
        // Seed dummy users
        // if (userRepo.count() == 0) {
        // User user1 = new User();
        // user1.setName("Alice");
        // userRepo.save(user1);

        // User user2 = new User();
        // user2.setName("Bob");
        // userRepo.save(user2);
        // }

        // RestTemplate rest = new RestTemplate();

        // Map res = rest.getForObject("https://dummyjson.com/products?limit=194",
        // Map.class);
        // List<Map<String, Object>> products = (List<Map<String, Object>>)
        // res.get("products");

        // for (Map<String, Object> p : products) {

        // Long id = ((Number)p.get("id")).longValue();

        // if(productRepo.existsById(id)) continue;

        // Product product = new Product();
        // product.setId(id);
        // product.setTitle((String)p.get("title"));
        // product.setDescription((String)p.get("description"));
        // product.setCategory((String)p.get("category"));
        // product.setPrice(new BigDecimal(p.get("price").toString()));
        // product.setDiscountPercentage(new
        // BigDecimal(p.get("discountPercentage").toString()));
        // product.setRating(new BigDecimal(p.get("rating").toString()));
        // product.setStock((Integer)p.get("stock"));
        // product.setBrand((String)p.get("brand"));
        // product.setThumbnail((String)p.get("thumbnail"));

        // productRepo.save(product);

        // List<String> images = (List<String>) p.get("images");
        // for (String img : images) {
        // ProductImage image = new ProductImage();
        // image.setProductId(id);
        // image.setImageUrl(img);
        // imageRepo.save(image);
        // }
        // }
    }
}