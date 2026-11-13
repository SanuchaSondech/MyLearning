import java.util.*;

public class SimpleGraph {
    public static void main(String[] args) {
        int n = 5;
        List<List<Integer>> graph = new ArrayList<>();

        
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }

         
        addEdge(graph, 0, 1);
        addEdge(graph, 0, 4);
        addEdge(graph, 1, 2);
        addEdge(graph, 1, 3);
        addEdge(graph, 1, 4);
        addEdge(graph, 2, 3);
        addEdge(graph, 3, 4);

       
        printGraph(graph);
    }

    
    public static void addEdge(List<List<Integer>> graph, int u, int v) {
        graph.get(u).add(v);
        graph.get(v).add(u);  
    }

     
    public static void printGraph(List<List<Integer>> graph) {
        for (int i = 0; i < graph.size(); i++) {
            System.out.print("โหนด " + i + " เชื่อมกับ: ");
            for (int neighbor : graph.get(i)) {
                System.out.print(neighbor + " ");
            }
            System.out.println();
        }
    }

    
}
